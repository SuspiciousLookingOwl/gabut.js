// From https://github.com/EdouardCourty/user-instagram
import fetch from "node-fetch";
import puppeteer from "puppeteer";
import fs from "fs";
import { promisify } from "util";
import dotenv from "dotenv";

const normalizeUrl = (string: string) => {
	if (!string.match(/instagram\.com\/[^/]*/)) {
		string = `https://www.instagram.com/${string}`;
	}
	return (string += "/?__a=1");
};

const normalizePostUrl = (string: string) => {
	if (!string.match(/instagram\.com\/p\/[^/]*/)) {
		string = `https://www.instagram.com/p/${string}`;
	}
	return (string += "/?__a=1");
};

const stringifyEnv = async (obj: dotenv.DotenvParseOutput) => {
	let result = "";
	for (const [key, value] of Object.entries(obj)) {
		if (key) {
			const line = `${key}=${String(value)}`;
			result += line + "\n";
		}
	}
	return result;
};

const getSessionId = async (username: string, password: string): Promise<string> => {
	return new Promise((resolve, reject) => {
		(async () => {
			const writeFile = promisify(fs.writeFile);
			const env = dotenv.config().parsed;
			if (!env) return reject(new Error(".env file not found"));
			if (env.INSTAGRAM_SESSION_ID) return resolve(env.INSTAGRAM_SESSION_ID);

			// Open Browser and Page, then go to login page
			const browser = await puppeteer.launch();
			const page = await browser.newPage();
			await page.goto("https://www.instagram.com/accounts/login/");

			//  Create listener and listen for received cookie
			const client = await page.target().createCDPSession();
			await client.send("Network.enable");
			client.on("Network.responseReceivedExtraInfo", async (response) => {
				if (!response || !response.headers) return;
				if (
					!("set-cookie" in response.headers) ||
					!response.headers["set-cookie"].includes("sessionid")
				)
					return;
				const cookie = response.headers["set-cookie"];
				const sessionId = cookie.split("sessionid=")[1].split(";")[0];
				env.INSTAGRAM_SESSION_ID = sessionId;
				await writeFile(".env", await stringifyEnv(env));
				await browser.close();
				return resolve(env.INSTAGRAM_SESSION_ID);
			});

			// Wait for form to load, fill in username & password, then click Login button
			await page.waitForSelector(".Igw0E > .-MzZI:nth-child(1) > ._9GP1n > .f0n8F > ._2hvTZ");
			await page.click(".Igw0E > .-MzZI:nth-child(1) > ._9GP1n > .f0n8F > ._2hvTZ");
			await page.type(".Igw0E > .-MzZI:nth-child(1) > ._9GP1n > .f0n8F > ._2hvTZ", username);
			await page.type(".Igw0E > .-MzZI:nth-child(2) > ._9GP1n > .f0n8F > ._2hvTZ", password);
			await page.waitForSelector("#loginForm > .Igw0E > .Igw0E > .sqdOP > .Igw0E");
			await page.click("#loginForm > .Igw0E > .Igw0E > .sqdOP > .Igw0E");

			page.on("response", (response) => {
				if (
					response.url() === "https://www.instagram.com/accounts/login/ajax/" &&
					response.status() !== 200
				)
					reject(new Error("Failed to Login"));
			});
		})();
	});
};

const getUserData = async (username: string) => {
	const url = normalizeUrl(username);
	const REQUEST_PARAMETERS = {
		headers: {
			"user-agent":
				"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36",
			authority: "www.instagram.com",
			"cache-control": "max-age=0",
			Cookie: `sessionid=${await getSessionId(
				process.env.INSTAGRAM_USERNAME as string,
				process.env.INSTAGRAM_PASSWORD as string
			)};`,
		},
	};
	const GQL = await (
		await fetch(url, {
			headers: REQUEST_PARAMETERS.headers,
		})
	).json();
	if (GQL) {
		const user = GQL.graphql.user;
		return {
			link: url.replace("/?__a=1", ""),
			id: user.id,
			biography: user.biography,
			subscribersCount: user.edge_followed_by.count,
			subscriptions: user.edge_follow.count,
			fullName: user.full_name,
			highlightCount: user.highlight_reel_count,
			isBusinessAccount: user.is_business_account,
			isRecentUser: user.is_joined_recently,
			accountCategory: user.business_category_name,
			linkedFacebookPage: user.connected_fb_page,
			isPrivate: user.is_private,
			isVerified: user.is_verified,
			profilePic: user.profile_pic_url,
			profilePicHD: user.profile_pic_url_hd,
			username: user.username,
			postsCount: user.edge_owner_to_timeline_media.count,
			posts:
				user.edge_owner_to_timeline_media.edges.map((edge: any) => {
					const hasCaption = edge.node.edge_media_to_caption.edges[0];
					return {
						id: edge.node.id,
						shortCode: edge.node.shortcode,
						url: `https://www.instagram.com/p/${edge.node.shortcode}/`,
						dimensions: edge.node.dimensions,
						imageUrl: edge.node.display_url,
						isVideo: edge.node.is_video,
						caption: hasCaption ? hasCaption.node.text : "",
						commentsCount: edge.node.edge_media_to_comment.count,
						commentsDisabled: edge.node.comments_disabled,
						timestamp: edge.node.taken_at_timestamp,
						likesCount: edge.node.edge_liked_by.count,
						location: edge.node.location,
						children: edge.node.edge_sidecar_to_children
							? edge.node.edge_sidecar_to_children.edges.map((edge: any) => {
									return {
										id: edge.node.id,
										shortCode: edge.node.shortcode,
										dimensions: edge.node.dimensions,
										imageUrl: edge.node.display_url,
										isVideo: edge.node.is_video,
									};
							  })
							: [],
					};
				}) || [],
		} as const;
	}
};

const getPostData = async (shortcode: string) => {
	const url = normalizePostUrl(shortcode);
	const REQUEST_PARAMETERS = {
		headers: {
			"user-agent":
				"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36",
			authority: "www.instagram.com",
			"cache-control": "max-age=0",
		},
	};
	const GQL = await (await fetch(url, REQUEST_PARAMETERS)).json();
	if (GQL) {
		const media_data = GQL.graphql.shortcode_media;
		const has_caption = media_data.edge_media_to_caption.edges.length > 0;
		return {
			link: url.replace("/?__a=1", ""),
			shortcode: media_data.shortcode,
			dimensions: media_data.dimensions,
			displayUrl: media_data.display_url,
			isVideo: media_data.is_video,
			wasCaptionEdited: media_data.caption_is_edited,
			caption: has_caption ? media_data.edge_media_to_caption.edges[0].node.text : null,
			commentsCount: media_data.edge_media_to_parent_comment.count,
			areCommentsDisabled: media_data.comments_disabled,
			takenAt: media_data.taken_at_timestamp,
			likesCount: media_data.edge_media_preview_like.count,
			location: media_data.location
				? {
						id: media_data.location.id,
						hasPublicPage: media_data.location.has_public_page,
						name: media_data.location.name,
						slug: media_data.location.slug,
						jsonName: media_data.location.address_json,
				  }
				: null,
			owner: {
				id: media_data.owner.id,
				username: media_data.owner.username,
				profilePicture: media_data.owner.profile_pic_url,
				full_name: media_data.owner.full_name,
				postsCount: media_data.owner.edge_owner_to_timeline_media,
				followersCount: media_data.owner.edge_followed_by,
				isPrivate: media_data.owner.is_private,
				isVerified: media_data.owner.is_verified,
			},
			isAnAd: media_data.is_ad,
			childrenPictures: media_data.edge_sidecar_to_children
				? media_data.edge_sidecar_to_children.map((edge: any) => {
						return {
							id: edge.node.id,
							shortcode: edge.node.shortcode,
							dimensions: edge.node.dimensions,
							displayUrl: edge.node.display_url,
							isVideo: edge.node.is_video,
						};
				  })
				: [],
			comments: media_data.edge_media_to_parent_comment.edges.map((edge: any) => {
				return {
					id: edge.node.id,
					text: edge.node.text,
					createdAt: edge.node.created_at,
					author: {
						id: edge.node.owner.id,
						isVerified: edge.node.owner.is_verified,
						username: edge.node.owner.username,
						profilePicture: edge.node.owner.profile_pic_url,
					},
					likesCount: edge.node.edge_liked_by.count,
				};
			}),
			taggedUsers: media_data.edge_media_to_tagged_user.edges
				? media_data.edge_media_to_tagged_user.edges.map((tag: any) => {
						return {
							fullName: tag.node.user.full_name,
							id: tag.node.user.id,
							isVerified: tag.node.user.is_verified,
							username: tag.node.user.username,
							tagLocation: {
								x: tag.node.x,
								y: tag.node.y,
							},
						};
				  })
				: null,
		};
	}
};

export default {
	getUserData,
	getPostData,
};

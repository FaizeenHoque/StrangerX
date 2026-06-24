import { SITEURL } from "$env/static/private";
import { redirect, type RequestHandler } from "@sveltejs/kit";

export const GET = async ({ cookies }) => {
    cookies.set("access_token", "guest", {
        httpOnly: true,
        secure: true, // set true in production (HTTPS)
        path: "/"
    });

    cookies.set("refresh_token", "guest", {
        httpOnly: true,
        secure: false,
        path: "/"
    });

    throw redirect(302, "/matchmaking");
};
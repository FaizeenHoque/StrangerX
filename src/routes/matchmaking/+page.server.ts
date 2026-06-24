import { redirect } from "@sveltejs/kit";

export const load = async ({ fetch, cookies }) => {
    const token = cookies.get("access_token");

    if (!token) {
        throw redirect(302, "/");
    }

    if (token === "guest") {
        return; 
    }

    const res = await fetch("https://auth.hackclub.com/api/v1/me", {
        headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
        cookies.delete("access_token", { path: "/" });
        cookies.delete("refresh_token", { path: "/" });
        throw redirect(302, "/");
    }
};

export async function sendNtfyNotification(
    topic: string,
    title: string,
    message: string
) {
    const response = await fetch(`https://ntfy.sh/${topic}`, {
        method: "POST",
        body: message,
        headers: {
            Title: title,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to send ntfy notification");
    }
}
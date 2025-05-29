class discord_log {
    constructor(color, description, webhook, thumbnail) {
        this.color = color;
        this.description = description;
        this.thumbnail = thumbnail;
        this.webhook = webhook;
    }

    async send() {
        const body = {
            username: "Chatio Logger",
            embeds: [
                {
                    title: "User Log",
                    description: this.description,
                    color: Number(this.color),
                    timestamp: new Date().toISOString(),
                    thumbnail: {
                        url: `http://localhost:3500/image/profile/2`
                        
                    }
                }
            ]
        };

        await fetch(this.webhook, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });
    }
}

module.exports = discord_log;

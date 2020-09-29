import { KlasaMessage, Monitor, MonitorStore } from 'klasa';
import applicationSettings from '../settings';

export default class extends Monitor {
	public constructor(store: MonitorStore, file: string[], directory: string) {
		super(store, file, directory, { enabled: true, ignoreOthers: false });
	}

	async run(message: KlasaMessage) {
		
		const attachment = message.attachments.first();
		if (!attachment) return;

		await message.react(applicationSettings.emojis.twitter);
        await message.react(applicationSettings.emojis.facebook);
        await message.react(applicationSettings.emojis.instagram);
        await message.react(applicationSettings.emojis.reddit);

		return;
	}
}
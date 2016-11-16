console.log('Hello from dashlane-form-checker (background)')

chrome.contextMenus.create({
	id: "dashlane-form-checker-1",
	title: "option 1",
	contexts: ["all"]
})

chrome.contextMenus.create({
	id: "dashlane-form-checker-2",
	title: "option 2",
	contexts: ["all"]
})

var notification_id = "cake-notification"
chrome.notifications.create(notification_id, {
	"type": "basic",
	"iconUrl": chrome.extension.getURL("icons/icon_48x48.png"),
	"title": "dashlane-form-checker notification",
	"message": "dashlane-form-checker notif from background"
})

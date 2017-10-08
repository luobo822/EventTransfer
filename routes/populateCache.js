module.exports = function(fs, zcache) {
	//  Local cache for static content.
	var path = "./web/"
	zcache['index.html'] = fs.readFileSync(path + 'index.html');
	zcache['login.html'] = fs.readFileSync(path + 'login.html');
	zcache['package.html'] = fs.readFileSync(path + 'Quest/package.html');
	zcache['quest.html'] = fs.readFileSync(path + 'Quest/quest.html');
	zcache['command.html'] = fs.readFileSync(path + 'Command/command.html');
	zcache['action.html'] = fs.readFileSync(path + 'Command/action.html');
	zcache['csv.html'] = fs.readFileSync(path + 'Interface/csv.html');
	zcache['requirement.html'] = fs.readFileSync(path + 'Interface/requirement.html');
	zcache['teamlistfile.html'] = fs.readFileSync(path + 'Interface/teamlistfile.html');
	zcache['eventselect.html'] = fs.readFileSync(path + 'Event/eventselect.html');
	zcache['shime.html'] = fs.readFileSync(path + 'Interface/shime.html');
	zcache['selfsettlement.html'] = fs.readFileSync(path + 'Settlement/settlement.html');
	zcache['statusscreen.html'] = fs.readFileSync(path + 'Command/statusscreen.html');
	zcache['infopad.html'] = fs.readFileSync(path + 'Quest/infopad.html');
	zcache['event.html'] = fs.readFileSync(path + 'Event/event.html');
	zcache['team.html'] = fs.readFileSync(path + 'Event/team.html');
	zcache['quest_view.html'] = fs.readFileSync(path + 'Event/quest_view.html');
	zcache['quest_goods.html'] = fs.readFileSync(path + 'Event/quest_goods.html');
	zcache['quest_task.html'] = fs.readFileSync(path + 'Event/quest_task.html');
	zcache['quest_teamview.html'] = fs.readFileSync(path + 'Event/quest_teamview.html');
	zcache['public_eventinfo.html'] = fs.readFileSync(path + 'Public/public_eventinfo.html');
	zcache['public_menuinfo.html'] = fs.readFileSync(path + 'Public/public_menuinfo.html');
	zcache['quest_self.html'] = fs.readFileSync(path + 'Event/quest_self.html');
	zcache['quest_teamview_mgroup.html'] = fs.readFileSync(path + 'Event/quest_teamview_mgroup.html');
}
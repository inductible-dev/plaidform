var build_debug = function()
{
	console.log('build debug (todo)');
	return 0	;
}	

var build_release = function()
{
	console.log('build release (todo)');
	return 0;
}

var run = function(process)
{
	var scriptName = process.argv[1];
	var buildType = process.argv[2];
	var status ;
	switch(buildType)
	{
		case '--debug':
			status = build_debug();
		break;
		case '--release':
			status = build_release();
		default:
	}
	process.exit(status);
}
run(process);
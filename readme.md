Deploy
======

General
-------

These scripts deploy Node apps using pm2.

The name of the project (referred to as "project" below) is read from package.json.  The name of the deployment is specified on the command line, e.g.

`$ deploy prod`

Structure
---------

Local, per sproject:

./deploy

	/hooks
	
		/local
		
			/pre-deploy
			/post-deploy
		
		/remote
		
			/pre-deploy
			/post-deploy

	/secrets

Hooks can also have a .js extension.

Remote:

~

	/apps: checked-out code for deployments
	
		/[project]
		
			/[deployment]
	
	/git: bare repos
	
	/secrets
	
		/[project]: secrets for whole project (structure decided by app)
	
	/storage
	
		/[project]
		
			/[deployment]

ecosystem.config.js
-------------------

This is copied to remote on each deploy, so the working dir version is always used, even if deploying a branch/tag that has a different version.

The app name must be project-deployment, e.g. myApp-prod.

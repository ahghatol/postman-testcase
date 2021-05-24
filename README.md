### Run multiple collections sharing a common environment

There is no feature available in postman to do this, But there is a workaround I discovered

Add following code at line 98 (after "var emitter = new EventEmitter(),runner = new runtime.Runner(),stopOnFailure,entrypoint;") (inside node_modules/newman/lib/run/index.js):
```
if(_.isArray(options.collection)){
        let obj = {};
        obj.info = options.collection[0].info;
        obj.info.name = "combined";
        obj.item = [];
        for(let i=0; i<options.collection.length; i++){
            obj.item.push({name:"file"+(i+1),item:options.collection[i].item});
        }
        options.collection = obj;
}
```
refer: https://github.com/postmanlabs/newman/issues/2262

## Run script
Navigate to script folder and run commands
```
$ npm install
$ node collection-runner.js
```
To run specific collection use below command 
```
$ node collection-runner.js -f collection_file_path 
```

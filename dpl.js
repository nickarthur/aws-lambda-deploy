require('./test/00_env.test.js'); // check if AWS keys are set
var dpl = require('./lib/index.js');
var pkg = require(dpl.utils.get_base_path() + 'package.json');
if (pkg.files_to_deploy.indexOf('.env') > -1) {
  dpl.utils.make_env_file(); // see: https://github.com/numo-labs/aws-lambda-deploy/issues/31
}
dpl.copy_files();                    // copy required files & dirs
dpl.install_node_modules();          // install only production node_modules
dpl.zip();                           // zip the /dist directory
dpl.upload(function (err, data) {    // upload the .zip file to AWS:
  if (err) {
    console.log('- - -  - - - - - - - - - - - - - - - - - - - - DEPLOY ERROR');
    console.log(err);
    console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -');
  }
  console.log('Lambda Function:');
  console.log(data);
  dpl.utils.clean_up();              // delete /dist and .zip file for next time
});

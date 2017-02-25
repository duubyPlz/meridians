// Router.configure({
//     loadingTemplate: "loading",
//     notFoundTemplate: "notFound",
// })

Router.route('/', function () {
  this.render('main');
  this.layout('layout');
 });
var T3App = angular.module('T3App', ['ui.router']);

T3App.config([
'$stateProvider',
'$urlRouterProvider',
function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: '/home.html',
            controller: 'T3Ctrl'
        })
        .state('board', {
            url: '/board',
            templateUrl: '/board.html',
            controller: 'T3Ctrl'
        })
        .state('about', {
            url: '/about',
            templateUrl: '/about.html',
            controller: 'T3Ctrl'
        })
        .state('settings', {
            url: '/settings',
            templateUrl: '/settings.html',
            controller: 'T3Ctrl'
        });

    $urlRouterProvider.otherwise('home');
}]);
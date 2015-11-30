(function() {
  'use strict';

  var app;

  app = angular.module('fc.autocomplete', []);

  app.directive('fcScroll', fcScroll);

  function fcScroll() {
    return function(scope, ele, attrs) {
      var list = ele.find('md-list')[0];
      ele.on('keydown', function(e) {        
        var index = attrs.fcScroll;
        var content = document.getElementById('dropdown-content-' + index);

        if(content) {
          list.scrollTop = content.offsetTop - content.offsetHeight;
        }
      });
    };
  }

  app.directive('fcAutoComplete', function() {
    return {
      scope: {
        wmpTotal: '=',
        position: '@',
        gotoPage: '&',
        step: '=',
        currentPage: '='
      },
      template: [
        '<md-input-container md-no-float class="auto-complete pdt1" ng-keydown="vm.getKey($event)" fc-scroll="{{ vm.index }}">',
        ' <input ng-model="vm.userinfo" ng-focus="vm.getSelectedList()" ng-click="vm.stopPropagation($event)" ng-change="vm.getSelectedList()" autocomplete="off" placeholder="请输入用户名或邮箱">',
        ' <md-list class="dropdown" ng-show="vm.startSelect">',
        '   <md-list-item id="dropdown-content-{{$index}}" ng-repeat="user in vm.slectedUserList">',
        '     <p class="content" ng-class="{true: \'hover\', false: \'\'}[vm.index === $index]" ng-click="vm.selectUser(user)" ng-mouseover="vm.updateState($index)">',
        '       {{ user.email }}',
        '       <span class="primary"> ({{ user.username }})</span>',
        '     </p>',
        '   </md-list-item>',
        ' </md-list>',
        '</md-input-container>',
      ].join(''),
      restrict: 'EA',
      controller: Controller,
      controllerAs: 'vm'
    };
  });

  function Controller($scope) {
    var vm = this;
    vm.index = 0;
    vm.userList = [{
      username: 'wanfeichao',
      email: 'wanfeichao@cvte.com'
    }, {
      username: 'len.may',
      email: 'len.may@foxmail.com'
    }, {
      username: 'frank',
      email: 'frank@frankly.ly'
    }, {
      username: 'wanfeichao-1',
      email: 'wanfeichao-1@cvte.com'
    }, {
      username: 'len.may-1',
      email: 'len.may-1@foxmail.com'
    }, {
      username: 'frank-1',
      email: 'frank-1@frankly.ly'
    }];

    vm.getKey = function(event) {
      switch (event.keyCode) {
        case 13: //enter key
          vm.selectUser(vm.slectedUserList[vm.index]);
          break;
        case 38: //up key
          if (vm.index > 0) {
            vm.index--;
          }
          break;
        case 40: //down key
          if (vm.index < vm.slectedUserList.length - 1) {
            vm.index++;
          }
          break;
        default:
          break;
      }
    };

    vm.stopPropagation = function(event) {
      event.stopPropagation();
    };

    vm.getSelectedList = function() {
      if(!vm.userinfo) {
        vm.slectedUserList = [];
        return;
      }

      var regExp = new RegExp(vm.userinfo, 'i');

      vm.slectedUserList = vm.userList.filter(function(dt) {
        return regExp.test(dt.username) || regExp.test(dt.email);
      });

      vm.index = 0;
      vm.startSelect = true;
    };

    vm.selectUser = function(user) {
      vm.userinfo = user.email;
      vm.startSelect = false;
    };

    vm.updateState = function(index) {
      vm.index = index;
    };
  }
})();

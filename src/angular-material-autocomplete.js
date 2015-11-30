(function() {
  'use strict';

  var app, contains;

  app = angular.module('fc.autocomplete', []);

  //directive: 下拉列表，按方向键滚动内容
  app.directive('fcScroll', function() {
    return function(scope, ele, attrs) {
      var list = ele.find('md-list')[0];
      ele.on('keydown', function(e) {
        var index = attrs.fcScroll;
        var content = document.getElementById('dropdown-content-' + index);

        if (content) {
          list.scrollTop = content.offsetTop - content.offsetHeight;
        }
      });
    };
  });

  //directive: 组件外点击隐藏下拉列表
  contains = function(container, contained) {
    var node;
    node = contained.parentNode;
    while (node !== null && node !== container) {
      node = node.parentNode;
    }
    return node !== null;
  };

  app.directive('outsideClick', ['$document', '$parse', function($document, $parse) {
    return {
      link: function($scope, $element, $attributes) {
        var onDocumentClick, scopeExpression;
        scopeExpression = $attributes.outsideClick;
        onDocumentClick = function(event) {
          if (!contains($element[0], event.target)) {
            $scope.$apply(scopeExpression);
          }
        };
        $document.on('click', onDocumentClick);
        $element.on('$destroy', function() {
          $document.off('click', onDocumentClick);
        });
      }
    };
  }]);

  //directive: autocomplete
  app.directive('fcAutoComplete', function() {
    return {
      scope: {
        placeholder: '@',
        listData: '='
      },
      template: [
        '<md-input-container md-no-float class="auto-complete" ng-keydown="vm.onKeyDown($event)" fc-scroll="{{ vm.index }}" ',
        '                    outside-click="vm.hideList()">',
        ' <input ng-model="vm.content" ng-focus="vm.getSelectedList()" ',
        '        ng-change="vm.getSelectedList()" autocomplete="off" placeholder="{{ vm.placeholder }}">',
        ' <md-list class="dropdown" ng-show="vm.canSelect">',
        '   <md-list-item id="dropdown-content-{{$index}}" ng-repeat="dt in vm.selectedList">',
        '     <p class="content" ng-class="{true: \'hover\', false: \'\'}[vm.index === $index]" ng-click="vm.setContent(dt)" ',
        '        ng-mouseover="vm.addHoverClass($index)">{{ dt }}</p>',
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
    vm.placeholder = $scope.placeholder;
    vm.data = $scope.listData;

    vm.onKeyDown = function(event) {
      switch (event.keyCode) {
        case 13: //enter
          vm.setContent(vm.selectedList[vm.index]);
          break;
        case 38: //up
          vm.index > 0 && vm.index--;
          break;
        case 40: //down
          vm.index < vm.selectedList.length - 1 && vm.index++;
          break;
        default:
          break;
      }
    };

    vm.getSelectedList = function() {
      if (!vm.content) {
        vm.selectedList = [];
        return;
      }

      var regExp = new RegExp(vm.content, 'i');

      vm.selectedList = vm.data.filter(function(dt) {
        return regExp.test(dt);
      });

      vm.index = 0;
      vm.showList();
    };

    vm.setContent = function(user) {
      vm.content = user;
      vm.hideList();
    };

    vm.addHoverClass = function(index) {
      vm.index = index;
    };

    vm.showList = function() {
      vm.canSelect = true;
    };

    vm.hideList = function() {
      vm.canSelect = false;
    };
  }
})();

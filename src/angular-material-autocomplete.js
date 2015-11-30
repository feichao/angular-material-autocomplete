(function() {
  'use strict';

  var app, contains;

  app = angular.module('fc.autocomplete', []);

  app.directive('fcScroll', fcScroll);

  function fcScroll() {
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
  }

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

  app.directive('fcAutoComplete', function() {
    return {
      scope: {
        placeholder: '@',
        listData: '='
      },
      template: [
        '<md-input-container md-no-float class="auto-complete" ng-keydown="vm.updateKey($event)" fc-scroll="{{ vm.index }}" ',
        '                    outside-click="vm.hideList()">',
        ' <input ng-model="vm.content" ng-focus="vm.getSelectedList()" ng-click="vm.stopPropagation($event)" ',
        '        ng-change="vm.getSelectedList()" autocomplete="off" placeholder="{{ placeholder }}">',
        ' <md-list class="dropdown" ng-show="vm.canSelect">',
        '   <md-list-item id="dropdown-content-{{$index}}" ng-repeat="user in vm.slectedUserList">',
        '     <p class="content" ng-class="{true: \'hover\', false: \'\'}[vm.index === $index]" ng-click="vm.select(user)" ',
        '        ng-mouseover="vm.updateState($index)">{{ user }}</p>',
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
    vm.data = $scope.listData;

    vm.updateKey = function(event) {
      switch (event.keyCode) {
        case 13: //enter key
          vm.select(vm.slectedUserList[vm.index]);
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
      if (!vm.content) {
        vm.slectedUserList = [];
        return;
      }

      var regExp = new RegExp(vm.content, 'i');

      vm.slectedUserList = vm.data.filter(function(dt) {
        return regExp.test(dt);
      });

      vm.index = 0;
      vm.showList();
    };

    vm.select = function(user) {
      vm.content = user;
      vm.hideList();
    };

    vm.updateState = function(index) {
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

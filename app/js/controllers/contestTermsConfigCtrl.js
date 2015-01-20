/*
 * Copyright (C) 2014 TopCoder Inc., All Rights Reserved.
 */
/**
 * The contest terms configuration controller.
 *
 * Changes in version 1.1 (Module Assembly - Web Arena -Match Management Update):
 * - Added load terms logic.
 *
 * @author TCSASSEMBLER
 * @version 1.1
 */
'use strict';
/*jshint -W097*/
/*jshint strict:false*/
/*jslint plusplus: true*/
/*global require*/
var config = require('../config');
var contestTermsConfigCtrl = ['$scope', '$http', 'sessionHelper', 'appHelper', '$rootScope', function ($scope, $http, sessionHelper, appHelper, $rootScope) {
    var
        /**
         * Header to be added to all http requests to api
         * @type {{headers: {Content-Type: string, Authorization: string}}}
         */
        header = appHelper.getHeader();

    /**
     * Initialize fields
     */
    function initFields() {
        $scope.roundTerms = '';
        $scope.round = undefined;
    }
    /*jslint unparam: true*/
    /**
     * Opens popup on setContestTerms event from contestManagementCtrl
     */
    $scope.$on('setContestTerms', function (event, data) {
        initFields();
        $scope.round = data.round;
        $scope.showPopup('contestTermsConfig');
    });
    /**
     * Submits contest terms
     */
    $scope.submitContestTermsConfig = function () {
        if (!$scope.roundTerms || $scope.roundTerms.trim().length === 0) {
            $scope.openModal({
                title: 'Error',
                message: 'The terms should not be empty.',
                enableClose: true
            });
            return;
        }
        // set terms
        $scope.round.roundTerms = $scope.roundTerms;
        $http.post(config.apiDomain + '/data/srm/rounds/' + $scope.round.id + '/terms', {terms: $scope.roundTerms}, header).
            success(function (data) {
                if (data.error) {
                    $rootScope.$broadcast('genericApiError', data);
                    return;
                }
                $scope.openModal({
                    title: 'Set Terms',
                    message: 'Terms have been updated successfully.',
                    enableClose: true
                });
                // close the popup
                $scope.closeContestTermsConfig();
            }).error(function (data) {
                $rootScope.$broadcast('genericApiError', data);
            });
    };
    /**
     * Closes round terms popup
     */
    $scope.closeContestTermsConfig = function () {
        $scope.hidePopup('contestTermsConfig');
    };
    /**
     * Loads existing terms for selected round
     */
    $scope.loadPreviousTerm = function () {
        //get terms
        if ($scope.round.roundTerms && $scope.round.roundTerms.length > 0) {
            $scope.roundTerms = $scope.round.roundTerms;
        } else {
            $scope.openModal({
                title: 'Warning',
                message: 'No terms in this round currently.',
                enableClose: true
            });
        }

    };
}];

module.exports = contestTermsConfigCtrl;
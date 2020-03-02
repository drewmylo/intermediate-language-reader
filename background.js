// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.runtime.onMessage.addListener(
  function (request) {
    if (request.vocabulary) {
      chrome.storage.local.set({ "vocabulary": request.vocabulary }, function () {
        console.log(request.vocabulary);
      });
    }
  });

chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
  chrome.declarativeContent.onPageChanged.addRules([{
    conditions: [new chrome.declarativeContent.PageStateMatcher({
      pageUrl: { hostContains: '.' },
    })],
    actions: [new chrome.declarativeContent.ShowPageAction()]
  }]);
});
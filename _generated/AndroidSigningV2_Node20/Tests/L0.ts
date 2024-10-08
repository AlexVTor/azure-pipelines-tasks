import fs = require('fs');
import assert = require('assert');
import path = require('path');
import * as ttm from 'azure-pipelines-task-lib/mock-test';

describe('AndroidSigning Suite', function () {
    this.timeout(parseInt(process.env.TASK_TEST_TIMEOUT) || 20000);
    before(() => {
    });

    after(() => {
    });

    it('Do not sign or zipalign if nothing is selected', async () => {
        let tp: string = path.join(__dirname, 'L0AndroidSkipSignAlign.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        await tr.runAsync();

        assert(tr.invokedToolCount === 0, 'should not run anything');
        assert(tr.stderr.length === 0, 'should not have written to stderr');
        assert(tr.succeeded, 'task should have succeeded');
    });

    it('Do not align or sign if input single file does not exist', async () => {
        let tp: string = path.join(__dirname, 'L0AndroidSignAlignNoFileInput.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        await tr.runAsync();

        assert(tr.invokedToolCount === 0, 'should not run anything');
        assert(tr.errorIssues.length || tr.stderr.length > 0, 'should have written to stderr');
        assert(tr.failed, 'task should have failed');
    });

    it('Do not align or sign if input pattern does not match any files', async () => {
        let tp: string = path.join(__dirname, 'L0AndroidSignAlignNoMatchingFileInput.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        await tr.runAsync();

        assert(tr.invokedToolCount === 0, 'should not run anything');
        assert(tr.errorIssues.length > 0 || tr.stderr.length > 0, 'should have written to stderr');
        assert(tr.failed, 'task should have failed');
    });

    it('Use jarsigner from PATH before searching in JAVA_HOME', async () => {
        let tp: string = path.join(__dirname, 'L0AndroidSignAlignJarsignerFromPath.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        await tr.runAsync();

        assert(tr.invokedToolCount == 1, 'should have run jarsigner');
        assert(tr.stderr.length == 0, 'should have jarsigned file');
        assert(tr.succeeded, 'task should have succeeded');
    });

    it('Fail if jarsigner is not on PATH and JAVA_HOME is not set', async () => {
        let tp: string = path.join(__dirname, 'L0AndroidSignAlignFailJarsignerNotFound.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        await tr.runAsync();

        assert(tr.invokedToolCount == 0, 'should not run anything');
        assert(tr.errorIssues.length > 0 || tr.stderr.length > 0, 'should have failed to locate jarsigner');
        assert(tr.failed, 'task should have failed');
    });

    it('Fail if ANDROID_HOME is not set', async () => {
        let tp: string = path.join(__dirname, 'L0AndroidSignAlignAndroidHomeNotSet.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        await tr.runAsync();

        assert(tr.invokedToolCount == 0, 'should not run anything');
        assert(tr.errorIssues.length > 0 || tr.stderr.length > 0, 'should have jarsigned file');
        assert(tr.failed, 'task should have failed');
    });

    it('Signing a single file', async () => {
        let tp: string = path.join(__dirname, 'L0AndroidSignSingleFile.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        await tr.runAsync();

        assert(tr.invokedToolCount === 1, 'should run jarsigner');
        assert(tr.errorIssues.length === 0 && tr.stderr.length === 0, 'should not have written to stderr');
        assert(tr.succeeded, 'task should have succeeded');
    });

    it('zipalign a single file', async () => {
        let tp: string = path.join(__dirname, 'L0AndroidZipalignSingleFile.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        await tr.runAsync();

        assert(tr.invokedToolCount === 1, 'should run zipalign');
        assert(tr.stderr.length === 0 || tr.errorIssues.length === 0, 'should not have written to stderr');
        assert(tr.succeeded, 'task should have succeeded');
    });

    it('Signing and aligning multiple files', async () => {
        let tp: string = path.join(__dirname, 'L0AndroidSignAlignMultipleFiles.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        await tr.runAsync();

        assert(tr.invokedToolCount === 4, 'should have run jarsigner and zipalign twice each');
        assert(tr.stderr.length === 0 || tr.errorIssues.length === 0, 'should not have written to stderr');
        assert(tr.succeeded, 'task should have succeeded');
    });

    it('Download keystore file from SecureFile', async () => {
        let tp: string = path.join(__dirname, 'L0DownloadKeystoreFile.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        await tr.runAsync();

        assert(tr.stderr.length === 0, 'should not have written to stderr');
        assert(tr.succeeded, 'task should have succeeded');
    });
});

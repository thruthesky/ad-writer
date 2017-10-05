import { Component, ViewChild, OnDestroy } from '@angular/core';

import { HttpClient } from '@angular/common/http';


import { AppService } from './../../providers/app.service';
import { PostCreateComponent } from '../../../angular-xapi/components/post-create/post-create';
import { SimpleTinyComponent } from './simple-tiny';

const spawn = require('child_process').spawn;



@Component({
    selector: 'write-page',
    templateUrl: 'write.html'
})
export class WritePage implements OnDestroy {
    @ViewChild('postCreateComponent') postCreateComponent: PostCreateComponent;
    @ViewChild('tiny') tiny: SimpleTinyComponent;

    sites = {};
    sitesOn;
    results = {};

    autoPostingProcessMessage = {};
    autoPostingProcessLoader = {};

    showBrowser = false;

    constructor(
        public app: AppService,
        private http: HttpClient
    ) {
        console.log("write page: server url: ", app.xapi.getServerUrl());

        app.xapi.version().subscribe(re => console.log('version: ', re));

        if (app.user.isLogin) {
            this.sitesOn = app.referenceSite().on('value', snap => {
                if (snap.val()) {

                    this.sites = snap.val();
                }
                console.log("this site: ", this.sites);
            });
        }
        // this.autoPosting( 'jjjo@adwriter_com', '-KvI63YLMcjKNL_3McAC' );
    }

    sitesKeys() {
        return Object.keys( this.sites );
    }

    ngOnDestroy() {
        if ( this.sitesOn ) this.app.referenceSite().off('value', this.sitesOn);
    }

    // tinyMceKeyup(content) {
    //     this.postCreateComponent.post_content = content;
    // }

    get self(): WritePage {
        return this;
    }
    hookPostCreate(event) {
        if (event.action === 'submit') {
            let content = this.tiny.editor.getContent();
            this.postCreateComponent.post_content = content;
        }
        else if (event.action === 'file-uploaded') {
            console.log("File uploaded: ", event.file);
            tinymce.activeEditor.insertContent('<img style="max-width: 100%; height: auto;" src="' + event.file.url + '"/>');
        }
    }
    async onPostCreatSuccess(post_id) {
        const c = this.postCreateComponent;
        console.log(`WritePage::onPostCreateSuccess ${post_id}`);
        // console.log('title: ', c.post_title);



        let data = {
            title: c.post_title ? c.post_title : '',
            content: this.tiny.editor.getContent(),
            files: c.files
        };

        console.log("data: ", data);
        const push = this.app.db.child('ad-write').child(this.app.userId).push();
        const key = push.key;
        await push.set(data);

        console.log("finished push: key: ", key);



        // console.log("sites: ", this.results);

        this.autoPosting(this.app.userId, key);

    }



    autoPosting(user, key) {


        this.autoPostingProcessMessage = {};
        this.autoPostingProcessLoader = {};

        for (const name of Object.keys(this.results)) {
            if (this.results[name]) {

                let site = this.sites[name];
                const script = site.site;
                const category = site.category;
                const id = site.id;
                const password = site.password;
                const endpoint = site.endpoint;

                if ( script === 'blogapi' ) {
                    this.blogApi(site);
                }
                else {
                    console.log("site running: ", site);
                    this.fork(script, name, user, key, category, id, password);
                }

            }
        }


    }

    blogApi( site ) {
        this.prepare( site.name );
        console.log("blog api begin: ", site);
        let body = {};

        const c = this.postCreateComponent;
        body['username'] = site.id;
        body['password'] = site.password;
        body['endpoint'] = site.endpoint;
        body['title'] = c.post_title ? c.post_title : '';
        body['description'] = this.tiny.editor.getContent();

        console.log('body: ', body);

        this.http.post( 'http://keyword-rank-observer-server.sonub.com/api/metaWeblog.newPost.php', body )
            .subscribe( re => {
                console.log("re: ", re);
                this.success(site.name);
            }, e => {
                console.log("error: ", e);
                this.error(site.name, e.message);
            });
    }

    fork(script, pid, user, key, category, id, password) {


        this.prepare(pid);

        const $params = [`auto-post/dist/src/task/${script}.js`,
        `--user=${user}`,
        `--key=${key}`,
        `--category=${category}`,
        `--id=${id}`,
        `--password=${password}`,
        `--pid=${pid}`,
        `--browser=${this.showBrowser}`
        ];
        console.log("node " + $params.join(' '));
        const ls = spawn('node', $params);
        console.log("loader: ", this.autoPostingProcessLoader);
        ls.stdout.on('data', (data) => {
            let arr = data.toString().split('=');
            let pid = arr[0];
            let re = arr[1].trim();

            if (re === 'success:') {
                this.success(pid);
            }
            else {
                this.message( pid, re) ;
            }
        });
        ls.stderr.on('data', (data) => {
            console.log(`ERROR: ${data}`);
            let errstr = data.toString();
            let msg = '';
            if (errstr.indexOf('Cannot find module') !== -1) {
                msg = `Error: cannot find ${script} script.`;
            }
            else {
                msg = `Error: process error.`;
            }
            this.error( pid, msg );

        });
        ls.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });
    }

    
    prepare(pid) {
        this.autoPostingProcessLoader[pid] = 0;
        this.autoPostingProcessMessage[pid] = 'preparing';
        this.app.render();
    }
    error( pid, msg ) {
        console.log("error() : ", pid, msg);
        this.autoPostingProcessMessage[pid] = msg;
        this.autoPostingProcessLoader[pid] = 2;
        this.app.render(100);
    }
    success( pid ) {
        this.autoPostingProcessLoader[pid] = 1;
        this.autoPostingProcessMessage[pid] = 'success';
        this.app.render(100);
    }
    message( pid, msg ) {
        this.autoPostingProcessMessage[pid] = msg;
        this.app.render(100);
    }
}

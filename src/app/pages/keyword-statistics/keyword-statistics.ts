import { Component } from '@angular/core';
import { AppService } from '../../providers/app.service';
import { date, time } from 'locutus/php/datetime';


// const sqlite3 = require('sqlite3').verbose();
// const db = new sqlite3.Database('keyword-ranks.sqlite');

@Component({
    selector: 'keyword-statistics-page',
    templateUrl: './keyword-statistics.html'
})
export class KeywordStatisticsPage {
    constructor(
        public app: AppService
    ) {


        let yesterday = date("Y-m-d-H-i", time() - 60 * 60 * 24 );
        app.db.child("keyword-rank-naver").set(null);




// db.serialize(function() {

//     db.run("CREATE TABLE lorem (info TEXT)");
  
//     var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
//     for (var i = 0; i < 10; i++) {
//         stmt.run("Ipsum " + i);
//     }
//     stmt.finalize();
  
//     db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
//         console.log(row.id + ": " + row.info);
//     });
//   });


    }
}

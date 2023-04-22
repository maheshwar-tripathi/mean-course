import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  // posts = [
  //   {title: 'First Post', content: 'this is the first\'s post content'},
  //   {title: 'Second Post', content: 'this is the second\'s post content'},
  //   {title: 'Third Post', content: 'this is the third\'s post content'},
  //   {title: 'Fourth Post', content: 'this is the fourth\'s post content'},
  //   {title: 'Fifth Post', content: 'this is the fifth\'s post content'},
  // ];

  @Input() posts: any = [];

  constructor() { }

  ngOnInit(): void {
  }

}

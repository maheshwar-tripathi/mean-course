import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   {title: 'First Post', content: 'this is the first\'s post content'},
  //   {title: 'Second Post', content: 'this is the second\'s post content'},
  //   {title: 'Third Post', content: 'this is the third\'s post content'},
  //   {title: 'Fourth Post', content: 'this is the fourth\'s post content'},
  //   {title: 'Fifth Post', content: 'this is the fifth\'s post content'},
  // ];

  posts: Post[] = [];
  private subscribePosts!: Subscription;

  constructor(public postsService: PostsService) { }

  ngOnInit(): void {
    this.postsService.getPosts();
    this.subscribePosts = this.postsService.getPostUpdateListener()
      .subscribe((updatePosts: Post[]) =>{
        this.posts =updatePosts;
      });
  }

  onDeletePost(postId: string) {
    this.postsService.deletePost(postId);
  }

  ngOnDestroy() {
    this.subscribePosts.unsubscribe();
  }

}

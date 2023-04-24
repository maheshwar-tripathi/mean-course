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

  posts: Post[] = [];
  isLoading = false;
  private subscribePosts!: Subscription;

  constructor(public postsService: PostsService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts();
    this.subscribePosts = this.postsService.getPostUpdateListener()
      .subscribe((updatePosts: Post[]) =>{
        this.posts = updatePosts;
        this.isLoading = false;
      });
  }

  onDeletePost(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId);
    this.isLoading = false;
  }

  ngOnDestroy() {
    this.subscribePosts.unsubscribe();
  }

}

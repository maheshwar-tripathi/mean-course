import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
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
  totalPosts = 0;
  pageSize = 3;
  currentPage = 1;
  pageSizeOptions = [1,2,5,10];
  showPageSizeOptions  = 1;

  constructor(public postsService: PostsService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts(this.pageSize, this.currentPage);
    this.subscribePosts = this.postsService.getPostUpdateListener()
      .subscribe((postData: {posts : Post[], postCount: number}) =>{
        this.posts = postData.posts;
        this.totalPosts = postData.postCount;
        this.isLoading = false;
      });
  }

  onDeletePost(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe( () => {
      this.postsService.getPosts(this.pageSize, this.currentPage);
    });
    this.isLoading = false;
  }

  ngOnDestroy() {
    this.subscribePosts.unsubscribe();
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.pageSize = pageData.pageSize;
    this.postsService.getPosts(this.pageSize, this.currentPage);
  }
}

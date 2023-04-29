import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';


import { Post } from './post.model';



@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postPerPage: number, currentPage: number) {
    const queryParam = `?pagesize=${postPerPage}&page=${currentPage}`;

    this.http.get<{message: string, posts: any, maxPosts: number}>(
        "http://localhost:3000/api/posts" + queryParam
      )
      .pipe(map((postsData) => {
        console.log(postsData.posts)
            return {
              posts: postsData.posts.map((post: any) => {
                return {
                  title: post.title,
                  content: post.content,
                  id: post._id,
                  imagePath: post.imagePath,
                  creator: post.creator
                }
              }),
              maxPosts: postsData.maxPosts
            };
        })
      )
      .subscribe((transformedPostsData) => {
        this.posts = transformedPostsData.posts;
        this.postsUpdated.next({ posts: [...this.posts], postCount: transformedPostsData.maxPosts});
      });
  }

  addPost(title: string, content: string, image: string) {
    const postData = new FormData();

    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title)

    this.http.post<{message: string, post: Post}>("http://localhost:3000/api/posts", postData)
      .subscribe((responseData) => {
        this.router.navigate(["/"]);
      });

  }

  deletePost(postId: string) {
    return this.http.delete("http://localhost:3000/api/posts/"+ postId);
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(postId: string) {
    return this.http.get<{
      _id: string,
      title:string,
      content:string,
      imagePath: string,
      creator: string
    }>("http://localhost:3000/api/posts/"+ postId);
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if(typeof(image) === 'object') {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: ''
      }
    }

    this.http.put<{message: string, imagePath: string}>("http://localhost:3000/api/posts/"+ id, postData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
  }

}

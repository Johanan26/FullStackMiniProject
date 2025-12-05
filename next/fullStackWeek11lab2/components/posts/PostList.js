import PostItem from './PostItem';
import classes from './PostList.module.css';

function PostList(props) {
  return (
    <ul className={classes.list}>
      {props.posts.map((post) => (
        <PostItem
          key={post._id}
          id={post._id}
          image={post.image}
          title={post.title}
          address={post.address}
        />
      ))}
    </ul>
  );
}

export default PostList;

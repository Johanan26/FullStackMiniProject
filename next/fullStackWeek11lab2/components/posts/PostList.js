import PostItem from './PostItem';
import classes from './PostList.module.css';

function PostList(props) {
  // Sort posts by _id (newest first - MongoDB ObjectIds contain timestamp)
  // For posts without _id, keep original order
  const sortedPosts = [...props.posts].sort((a, b) => {
    if (a._id && b._id) {
      // Compare ObjectIds - newer posts have larger ObjectIds
      return b._id.localeCompare(a._id);
    }
    return 0;
  });

  return (
    <ul className={classes.list}>
      {sortedPosts.map((post) => (
        <PostItem
          key={post._id}
          id={post._id}
          postId={post.postId}
          image={post.image}
          title={post.title}
          address={post.address}
          description={post.description}
          userId={post.userId}
          authorName={post.authorName}
        />
      ))}
    </ul>
  );
}

export default PostList;

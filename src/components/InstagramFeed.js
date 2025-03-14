export const InstagramFeed = ({ userId }) => {
  return {
    fetchPosts: () => {
      // Fetching posts for user ${userId}
      return Promise.resolve([{ id: 1, user: userId, caption: 'Sample post' }]);
    }
  };
};

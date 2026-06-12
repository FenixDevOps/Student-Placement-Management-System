import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Button, Grid, Chip, TextField, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch, CircularProgress, Alert, List, ListItem, ListItemText, Divider, Avatar, IconButton } from '@mui/material';
import { Forum, Send, Message, Person, ArrowBack, Delete, Campaign } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

interface Comment {
  commentId: number;
  content: string;
  authorName: string;
  isAnonymous: boolean;
  createdAt: string;
}

interface ForumPost {
  postId: number;
  title: string;
  content: string;
  category: string;
  authorName: string;
  isAnonymous: boolean;
  createdAt: string;
  comments: Comment[];
}

const categories = ['All', 'General', 'Interview Experience', 'Prep Material'];
const postCategories = ['General', 'Interview Experience', 'Prep Material'];

const ForumPage: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  // Post Dialog State
  const [openPostDialog, setOpenPostDialog] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [newAnonymous, setNewAnonymous] = useState(false);
  const [postSubmitting, setPostSubmitting] = useState(false);

  // Selected Thread Detail View
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [commentContent, setCommentContent] = useState('');
  const [commentAnonymous, setCommentAnonymous] = useState(false);
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: any = {
        page: 0,
        size: 50,
      };
      if (category !== 'All') params.category = category;
      if (search) params.search = search;

      const response = await api.get('/api/forum', { params });
      setPosts(response.data.content);
    } catch (err: any) {
      setError('Failed to fetch discussion posts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [category]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts();
  };

  const handleCreatePost = async () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    try {
      setPostSubmitting(true);
      setError(null);
      await api.post('/api/forum', {
        title: newTitle,
        content: newContent,
        category: newCategory,
        isAnonymous: newAnonymous,
      });
      setOpenPostDialog(false);
      setNewTitle('');
      setNewContent('');
      setNewCategory('General');
      setNewAnonymous(false);
      fetchPosts();
    } catch (err: any) {
      setError('Failed to submit post. Please try again.');
    } finally {
      setPostSubmitting(false);
    }
  };

  const handleCreateComment = async () => {
    if (!commentContent.trim() || !selectedPost) return;
    try {
      setCommentSubmitting(true);
      const response = await api.post(`/api/forum/${selectedPost.postId}/comment`, {
        content: commentContent,
        isAnonymous: commentAnonymous,
      });
      
      // Update comments in local state
      const updatedComment: Comment = response.data;
      const updatedPost = {
        ...selectedPost,
        comments: [...selectedPost.comments, updatedComment],
      };
      setSelectedPost(updatedPost);
      setPosts(prev => prev.map(p => p.postId === selectedPost.postId ? updatedPost : p));
      
      setCommentContent('');
      setCommentAnonymous(false);
    } catch (err: any) {
      setError('Failed to submit comment.');
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleDeletePost = async (postId: number) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await api.delete(`/api/forum/${postId}`);
      if (selectedPost?.postId === postId) {
        setSelectedPost(null);
      }
      setPosts(prev => prev.filter(p => p.postId !== postId));
    } catch (err: any) {
      setError('Failed to delete post.');
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Interview Experience':
        return 'success';
      case 'Prep Material':
        return 'secondary';
      case 'General':
      default:
        return 'primary';
    }
  };

  // If viewing a post thread
  if (selectedPost) {
    return (
      <Box>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => setSelectedPost(null)}
          sx={{ mb: 3 }}
        >
          Back to Discussions
        </Button>

        <Card sx={{ mb: 4, borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Avatar sx={{ bgcolor: selectedPost.isAnonymous ? 'text.disabled' : 'primary.main' }}>
                <Person />
              </Avatar>
              <Box>
                <Typography variant="body1" fontWeight="bold">
                  {selectedPost.isAnonymous ? 'Anonymous Member' : selectedPost.authorName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Posted on {new Date(selectedPost.createdAt).toLocaleString()}
                </Typography>
              </Box>
              <Box flexGrow={1} />
              <Chip 
                label={selectedPost.category} 
                color={getCategoryColor(selectedPost.category)} 
                size="small" 
                sx={{ fontWeight: 'bold' }} 
              />
            </Box>

            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {selectedPost.title}
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', color: 'text.primary', mt: 2 }}>
              {selectedPost.content}
            </Typography>
          </CardContent>
        </Card>

        {/* Reply Section */}
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Replies ({selectedPost.comments.length})
        </Typography>

        <Card sx={{ mb: 4, borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <TextField
              label="Write a helpful response..."
              multiline
              rows={3}
              fullWidth
              variant="outlined"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <FormControlLabel
                control={
                  <Switch 
                    checked={commentAnonymous} 
                    onChange={(e) => setCommentAnonymous(e.target.checked)} 
                  />
                }
                label="Reply anonymously"
              />
              <Button
                variant="contained"
                onClick={handleCreateComment}
                disabled={commentSubmitting || !commentContent.trim()}
                endIcon={<Send />}
                sx={{ borderRadius: 2 }}
              >
                Reply
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Comment Thread List */}
        <List sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {selectedPost.comments.map((comment) => (
            <Card key={comment.commentId} variant="outlined" sx={{ borderRadius: 2.5 }}>
              <CardContent sx={{ p: 2 }}>
                <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                  <Avatar sx={{ width: 28, height: 28, fontSize: '0.9rem', bgcolor: comment.isAnonymous ? 'text.disabled' : 'primary.light' }}>
                    <Person sx={{ fontSize: '1rem' }} />
                  </Avatar>
                  <Typography variant="body2" fontWeight="bold">
                    {comment.isAnonymous ? 'Anonymous Member' : comment.authorName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    &bull; {new Date(comment.createdAt).toLocaleString()}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', pl: 5.5 }}>
                  {comment.content}
                </Typography>
              </CardContent>
            </Card>
          ))}
          {selectedPost.comments.length === 0 && (
            <Alert severity="info" sx={{ borderRadius: 2 }}>Be the first to reply to this thread!</Alert>
          )}
        </List>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Discussion Forum
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Connect with peers, share interview tips, and ask preparation questions.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Forum />}
          onClick={() => setOpenPostDialog(true)}
          sx={{ fontWeight: 'bold', borderRadius: 2.5, px: 3, py: 1.2 }}
        >
          Create Post
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      {/* Category Chips and Search */}
      <Grid container spacing={3} alignItems="center" sx={{ mb: 4 }}>
        <Grid item xs={12} md={7} display="flex" gap={1} flexWrap="wrap">
          {categories.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              clickable
              color={category === cat ? 'primary' : 'default'}
              onClick={() => setCategory(cat)}
              sx={{ fontWeight: 'bold', py: 2, px: 1 }}
            />
          ))}
        </Grid>
        <Grid item xs={12} md={5}>
          <form onSubmit={handleSearchSubmit}>
            <TextField
              placeholder="Search posts..."
              size="small"
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                endAdornment: (
                  <Button type="submit" variant="text" size="small">
                    Search
                  </Button>
                ),
              }}
            />
          </form>
        </Grid>
      </Grid>

      {/* Posts Grid */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      ) : posts.length === 0 ? (
        <Alert severity="info" sx={{ borderRadius: 2 }}>No posts found in this category.</Alert>
      ) : (
        <Grid container spacing={3}>
          {posts.map((post) => (
            <Grid item xs={12} key={post.postId}>
              <Card 
                sx={{ 
                  borderRadius: 3, 
                  transition: 'all 0.2s', 
                  '&:hover': { 
                    transform: 'translateY(-2px)', 
                    boxShadow: 3,
                    cursor: 'pointer'
                  } 
                }}
                onClick={() => setSelectedPost(post)}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                    <Chip 
                      label={post.category} 
                      color={getCategoryColor(post.category)} 
                      size="small" 
                      sx={{ fontWeight: 'bold' }} 
                    />
                    <Typography variant="caption" color="text.secondary">
                      Posted by {post.isAnonymous ? 'Anonymous' : post.authorName} &bull; {new Date(post.createdAt).toLocaleDateString()}
                    </Typography>
                    <Box flexGrow={1} />
                    {user && (user.role === 'ADMIN' || (!post.isAnonymous && post.authorName === user.username)) && (
                      <IconButton 
                        color="error" 
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePost(post.postId);
                        }}
                      >
                        <Delete />
                      </IconButton>
                    )}
                  </Box>

                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {post.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      display: '-webkit-box', 
                      WebkitLineClamp: 3, 
                      WebkitBoxOrient: 'vertical',
                      mb: 2 
                    }}
                  >
                    {post.content}
                  </Typography>

                  <Divider sx={{ my: 1.5 }} />

                  <Box display="flex" alignItems="center" gap={0.5} color="text.secondary">
                    <Message sx={{ fontSize: '1.1rem' }} />
                    <Typography variant="body2" fontWeight="medium">
                      {post.comments.length} replies
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* New Post Dialog */}
      <Dialog 
        open={openPostDialog} 
        onClose={() => setOpenPostDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, p: 1 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>Create New Post</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3} mt={1}>
            <TextField
              label="Post Title"
              fullWidth
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={newCategory}
                label="Category"
                onChange={(e) => setNewCategory(e.target.value)}
              >
                {postCategories.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="What experience or preparation advice would you like to share?"
              multiline
              rows={5}
              fullWidth
              required
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />

            <FormControlLabel
              control={
                <Switch 
                  checked={newAnonymous} 
                  onChange={(e) => setNewAnonymous(e.target.checked)} 
                />
              }
              label="Post anonymously"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPostDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleCreatePost} 
            variant="contained" 
            disabled={postSubmitting || !newTitle.trim() || !newContent.trim()}
          >
            Post
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ForumPage;

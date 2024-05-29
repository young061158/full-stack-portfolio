import React from 'react'
import { useState } from 'react';
const ReviewPage = () => {
    const [comments, setComments] = useState([
        { id: 1, rating: 4, text: "이곳 세계입니다." }
    ]);
    const [newComment, setNewComment] = useState('');
    const [rating, setRating] = useState(0);

    const handleCommentChange = (event) => {
        setNewComment(event.target.value);
    };

    const submitComment = () => {
        const newCommentData = {
            id: comments.length + 1,  // Simplistic ID assignment
            rating: rating,
            text: newComment
        };
        setComments([...comments, newCommentData]);
        setNewComment('');
        setRating(0);  // Reset rating after submission
    };

    const handleRating = (rate) => {
        setRating(rate);
    };

    const renderRating = (rating, handleClick) => {
        return [...Array(5)].map((star, index) => {
            index += 1;
            return (
                <button
                    key={index}
                    className={`star ${index <= rating ? 'filled' : 'empty'}`}
                    onClick={() => handleClick ? handleClick(index) : null}
                >
                    {index <= rating ? '★' : '☆'}
                </button>
            );
        });
    };
    return (
        <div className='Review-container'>
            <div className="Review-main">
                <div className="comment-form">
                    <textarea
                        className="comment-input"
                        placeholder="글댓글을 남겨주세요."
                        maxLength="400"
                        value={newComment}
                        onChange={handleCommentChange}
                    />
                    <div className="rating-submit">
                        <span className="rating">
                            {renderRating(rating, handleRating)}
                        </span>
                        <button className="submit-btn" onClick={submitComment}>등록하기</button>
                    </div>
                </div>

                <div className="comment-list">
                    {comments.map((comment) => (
                        <div key={comment.id} className="comment">
                            <span className="comment-rating">{renderRating(comment.rating)}</span>
                            <p className="comment-text">{comment.text}</p>
                            <div className="comment-actions">
                                <button onClick={() => setComments(comments.filter(c => c.id !== comment.id))}>삭제</button>
                            </div>
                        </div>
                    ))}
                </div>

                <button className="view-more-btn">VIEW MORE</button>
            </div>
        </div>
    )
}

export default ReviewPage
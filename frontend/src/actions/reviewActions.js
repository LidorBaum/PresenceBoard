import reviewService from '../services/reviewService';

export function loadReviews() {
  return async dispatch => {
    try {
      const reviews = await reviewService.query();
      dispatch({ type: 'SET_REVIEWS', reviews });

    } catch (err) {
      console.log('ReviewActions: err in loadReviews', err);
    }
  };
}

export function addReview(review) {
  return async dispatch => {
    try {
      const addedReview = await reviewService.add(review);
      dispatch({ type: 'REVIEW_ADD', review: addedReview });
    } catch (err) {
      console.log('ReviewActions: err in addReview', err);
    }
  };
}

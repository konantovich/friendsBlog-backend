
import { body } from 'express-validator';


export const loginValidation = [
   body('email', 'Error mail format').isEmail(), 
   body('password', 'Password must be more than 5 characters').isLength({
      min: 5
   }) 
];

export const registerValidation = [
   body('email', 'Error mail format').isEmail(), 
   body('password', 'Password must be more than 5 characters').isLength({
      min: 5
   }), 
   body('fullName', 'Name must be more than 3 characters').isLength({ min: 3 }), 
   body('avatarUrl', 'Must be format string').optional().isString() 
];

export const postCreateValidation = [
   body('title', 'Enter the heading of the article')
      .isLength({ min: 3 })
      .isString(), 
   body('text', 'Enter the text of the article')
      .isLength({ min: 3 })
      .isString(), 
   body('tags', 'incorrect format of tags (indicate the array)')
      .optional()
      .isString(),
   body('imageUrl', 'incorrect string to the image').optional().isString() 
];

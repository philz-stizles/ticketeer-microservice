import { Schema, Model, model, Document } from 'mongoose';
import { Password } from './../services/password';

// Create an interface.
interface UserAttrs {
  email: string;
  password?: string;
}

// An interface that describes the properties that a User Model has
interface UserModel extends Model<UserDocument> {
  build(attrs: UserAttrs): UserDocument;
}

// An interface that describes the properties that a User Document has
interface UserDocument extends Document {
  email: string;
  password: string;
}

// Put as much business logic in the models to keep the controllers as simple and lean as possible
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }

  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

// Create a Model.
const User = model<UserDocument, UserModel>('User', userSchema);

export default User;

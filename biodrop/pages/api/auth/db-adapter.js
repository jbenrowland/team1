import { User, Account, Session, VerificationToken } from "@models/index";
 
/** @return { import("next-auth/adapters").Adapter } */

export default function DbAdapter(client) {

  const isSkipped = process.env.SKIP_MONGO === "true";
 
  if (isSkipped) {

    console.log("⚠️ SKIP_MONGO is true — using dummy adapter");
 
    // Return a no-op dummy adapter

    return {

      async createUser() { return null; },

      async getUser() { return null; },

      async getUserByEmail() { return null; },

      async getUserByAccount() { return null; },

      async updateUser() { return null; },

      async deleteUser() { return null; },

      async linkAccount() { return null; },

      async unlinkAccount() { return null; },

      async createSession() { return null; },

      async getSessionAndUser() { return null; },

      async updateSession() { return null; },

      async deleteSession() { return null; },

      async createVerificationToken() { return null; },

      async useVerificationToken() { return null; },

    };

  }
 
  // Standard adapter with DB access

  return {

    async createUser(data) {

      await client();

      return await User.create(data);

    },

    async getUser(id) {

      await client();

      return await User.findById(id);

    },

    async getUserByEmail(email) {

      await client();

      return await User.findOne({ email });

    },

    async getUserByAccount({ providerAccountId, provider }) {

      await client();

      const account = await Account.findOne({ providerAccountId, provider });

      if (!account) return null;

      return await User.findById(account.userId);

    },

    async updateUser(data) {

      await client();

      const { id, ...restData } = data;

      return await User.findByIdAndUpdate(id, restData, {

        new: true,

        runValidators: true,

        returnDocument: "after",

      });

    },

    async deleteUser(userId) {

      await client();

      return await User.findByIdAndDelete(userId);

    },

    async linkAccount(data) {

      await client();

      return await Account.create(data);

    },

    async unlinkAccount({ providerAccountId, provider }) {

      await client();

      return await Account.findOneAndDelete({ providerAccountId, provider });

    },

    async createSession(data) {

      await client();

      return await Session.create(data);

    },

    async getSessionAndUser(sessionToken) {

      await client();

      const session = await Session.findOne({ sessionToken });

      if (!session) return null;

      const user = await User.findById(session.userId);

      if (!user) return null;

      return { user, session };

    },

    async updateSession(data) {

      await client();

      const { id, ...restData } = data;

      return await Session.findByIdAndUpdate(id, restData, {

        new: true,

        runValidators: true,

      });

    },

    async deleteSession(sessionToken) {

      await client();

      return await Session.findOneAndDelete({ sessionToken });

    },

    async createVerificationToken(data) {

      await client();

      return await VerificationToken.create(data);

    },

    async useVerificationToken({ identifier, token }) {

      await client();

      return await VerificationToken.findOne({ identifier, token });

    },

  };

}

 

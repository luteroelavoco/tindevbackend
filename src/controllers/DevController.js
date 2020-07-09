const axios = require('axios');
const Dev = require("../models/Dev");


module.exports = {

    async index(req, res) {
        const { user } = req.headers;

        const loggedDev = await Dev.findById(user);

        const users = await Dev.find({
            $and: [
                { _id: { $ne: user } },
                { _id: { $nin: loggedDev.likes } },
                { _id: { $nin: loggedDev.dislikes } }
            ]
        })

        return res.json(users);

    },

    async store(req, res) {
        const { username } = req.body;

        const userExists = await Dev.findOne({ user: { $regex: `^${username}$`, $options: 'i' } });

        if (userExists) {
            return res.json(userExists);
        }

        await axios.get(`https://api.github.com/users/${username}`)
            .then(async (response) => {
                const { name, bio, avatar_url: avatar } = response.data;
                if (response.data.name) {
                    const dev = await Dev.create({
                        name,
                        user: username,
                        bio,
                        avatar
                    })
                    return res.json(dev);
                }else{
                    return res.status(406).json({ error: 'user with invalid name' });
                }
            }).catch(error => {
                return res.status(404).json({ error: 'user does´t exist' });
            })
       

    }
}
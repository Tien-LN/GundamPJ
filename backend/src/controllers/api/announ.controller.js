const { prisma } = require("../../config/db.js");


// [GET] /api/announcements
module.exports.getAllAnnouncements = async (req, res) => {
    try {
        const announcements = await prisma.announcement.findMany({
            select: {
                id: false,
                title: true,
                content: true,
            }
        })
        res.json(announcements);
    } catch (error) {
        res.status(500).json({ error: "SERVER ERROR!!!" });
    }
}

// [GET] /api/announements/:id

module.exports.getOneAnnouncement = async (req, res) => {
    try {
        const id = req.params.id;
        const announcement = await prisma.announcement.findUnique({
            where: {
                id: id,
                deleted: false
            }
        })

        res.json(announcement);

    } catch (error) {

        if (error.code === "P2025") {
            return res.status(404).json({ message: "Announcement not found!" });
        }
        res.status(500).json({ message: "Internal Server Error" });

    }
}

// [POST] /api/announcements/create
module.exports.createAnnouncement = async (req, res) => {
    await prisma.announcement.create({
        data: req.body
    });

    res.send("Create Announcement Successfully");
}

// [DELETE] /api/announcements/:id
module.exports.deleteAnnouncement = async (req, res) => {
    try {
        const id = req.params.id;

        await prisma.announcement.update({
            where: {
                id: id
            },
            data: {
                deleted: true
            },
        });

        res.send("Delete Announcement Successfully");

    } catch (error) {

        if (error.code === "P2025") {
            return res.status(404).json({ message: "Announcement not found!" });
        }
        res.status(500).json({ message: "Internal Server Error" });

    }
}

// [PATCH] /api/announcements/:id
module.exports.updateAnnouncement = async (req, res) => {
    try {
        const id = req.params.id;
        await prisma.announcement.update({
            where: {
                id: id,
                deleted: false
            },
            data: req.body
        });

        res.send("Update Announcement Successfully");

    } catch (error) {

        if (error.code === "P2025") {
            return res.status(404).json({ message: "Annoucement not found!" });
        }
        res.status(500).json({ message: "Internal Server Error" });

    }
}
import connectMongo from "../connection.js";
import Professor from "../models/Professor.js";
connectMongo();
export default async function getProfessorByAlias(req, res) {
    try {
        const { alias } = req.params;
        const professor = await Professor.findOne({ ALIAS: alias });
        if (!professor) {
            return res.status(404).json({ status: 'Professor not found' });
        }
        return res.json(professor);
    } catch (error) {
        console.log("Error in getProfessorByAlias:", error);
        res.status(400).json({ status: 'Error fetching professor' });
    }
}

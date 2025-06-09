import express from "express";
import cors from "cors";
import  { authMiddleware }  from "./middlewares/authMiddleware";
import { prismaClient } from "db/client";

const app = express();

app.use(express.json());
app.use(cors());

// Project creation endpoint
// after this endpoint user will hit workers service
app.post("/project", authMiddleware, async (req, res) => {
    try {
        const { prompt, framework } = req.body;
        const userId = req.userId;
        if(!userId) {
            res.status(401).json({message: "Unauthorized"});
            return;
        }
        const title = prompt.split("\n")[0];
        const description = prompt;

        //TODO: add logic to get usefull title for the project most probably that will be given by the llm itself
        const project = await prismaClient.project.create({
            data: { 
                userId,
                title,
                description,
                framework
            },
        });
        res.status(201).json({projectId: project.id})
    }catch(err) {
        console.log(`Project creation error: ${err}`);
        res.status(500).json({error: "Failed to create project"});
    }
})

// to get all the projects of the user in left side bar of the screen
app.get("/projects", authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        if(!userId) {
            res.status(401).json({message: "Unauthorized"});
            return;
        }
        const projects = await prismaClient.project.findMany({
            where: { userId }
        });
        res.json({projects});

    }catch(err) {
        console.log(`Project fetch error: ${err}`);;
        res.status(500).json({error: "Failed to fetch the projects"})
    }
})

app.listen(8080, () => {
    console.log("Server is runnig on port 8080");
})


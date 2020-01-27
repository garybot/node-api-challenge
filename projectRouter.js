const express = require('express');
const db = require('./data/helpers/projectModel.js');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const projects = await db.get();
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving projects.", error: err });
  }
});

router.get('/:id', validateProjectId, async (req, res) => {
  res.status(200).json(req.project);
});

router.get('/:id/actions', validateProjectId, async (req, res) => {
  try {
    const actions = await db.getProjectActions(req.params.id);
    res.status(200).json(actions);
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve actions for that project", error: err });
  }
});

router.post('/', validateProjectData, async (req, res) => {
  try {
    const project = await db.insert(req.body);
    res.status(201).json({ message: "Succesfully added project", project: project });
  } catch (err) {
    res.status(500).json({ message: "Failed to add project."});
  }
});

router.put('/:id', validateProjectId, validateProjectData, async (req, res) => {
  try {
    const updated = await db.update(req.params.id, req.body);
    res.status(201).json({ message: "Project succesfully updated", project: updated });
  } catch (err) {
    res.status(500).json({ message: "Failed to update project." });
  }
});

router.delete('/:id', validateProjectId, async (req, res) => {
  try {
   await db.remove(req.params.id);
   res.status(200).json({ message: "Succesfully removed project."});
  } catch (err) {
    res.status(500).json({ message: "Failed to remove project." });
  }
});

async function validateProjectId(req, res, next) {
  try {
    const project = await db.get(req.params.id);
    if (project) {
      req.project = project;
      next();
    } else {
      res.status(404).json({ message: "Project with that ID does not exist." });
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to check for ID.", error: err });
  }
}

function validateProjectData(req, res, next) {
  if (!req.body) {
    res.status(400).json({ message: "Missing project data." });
  } else if (!req.body.name || !req.body.description) {
    res.status(400).json({ message: "Missing require name or description field." });
  } else {
    next();
  }
}

module.exports = router;

const express = require('express');
const db = require('./data/helpers/actionModel.js');
const projectDb = require('./data/helpers/projectModel.js');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const actions = await projectDb.getProjectActions(req.project_id);
    res.status(200).json(actions);
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve actions for that project", error: err });
  }
});

router.get('/:action', validateActionId, async (req, res) => {
  try {
    const action = await db.get(req.params.action);
    res.status(200).json(action);
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve action by that id", error: err });
  }
});

router.post('/', validateAction, async (req, res) => {
  try {
    const action = await db.insert(req.body);
    res.status(201).json({ message: "Successfully added action.", action: action });
  } catch (err) {
    res.status(500).json({ message: "Failed to add action.", error: err });
  }
});

router.put('/:action', validateActionId, validateAction, async (req, res) => {
  try {
    const action = await db.update(req.params.action, req.body);
    res.status(200).json({ message: "Successfully updated action", action: action })
  } catch (err) {
    res.status(500).json({ message: "Failed to update action.", error: err });
  }
});

router.delete('/:action', validateActionId, async (req, res) => {
  try {
    await db.remove(req.params.action);
    res.status(200).json({ message: "Successfully removed action"});
  } catch (err) {
    res.status(500).json({ message: "Failed to remove action.", error: err });
  }
}); 

async function validateActionId(req, res, next) {
  try {
    const action = await db.get(req.params.action);
    if (action) {
      req.action = action;
      next();
    } else {
      res.status(404).json({ message: "Action with that ID does not exist." });
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to check for ID.", error: err });
  }
};

function validateAction(req, res, next) {
  if (!req.body.description) {
    res.status(400).json({ message: 'Missing require description field.' });
  } else if (!req.body.notes) {
    res.status(400).json({ message: 'Missing require notes field.' });
  } else {
    req.body.project_id = req.project_id;
    next();
  }
};

module.exports = router;

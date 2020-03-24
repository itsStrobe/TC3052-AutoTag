import { NextFunction, Request, Response, Router } from 'express';
import { getProjectRepository, Project } from './model';

export const router: Router = Router();

router.get('/project', async function (req: Request, res: Response, next: NextFunction) {
  try {
    const repository = await getProjectRepository();
    const allProjects = await repository.find();
    res.send(allProjects);
  }
  catch (err) {
    return next(err);
  }
});

router.get('/project/:id', async function (req: Request, res: Response, next: NextFunction) {
  try {
    const repository = await getProjectRepository();
    const project = await repository.find({id: Number(req.params.id)});
    res.send(project);
  }
  catch (err) {
    return next(err);
  }
});

router.post('/project', async function (req: Request, res: Response, next: NextFunction) {
  try {
    const repository = await getProjectRepository();
    const project = new Project();
    project.name = req.body.name;
    project.description = req.body.description;
    project.createDate = new Date();
    project.editDate = new Date();

    const result = await repository.save(project);
    res.send(result);
  }
  catch (err) {
    return next(err);
  }
});

router.post('/project/:id', async function (req: Request, res: Response, next: NextFunction) {
  try {
    const repository = await getProjectRepository();
    const project = await repository.findOne({id: Number(req.params.id)});
    project.name = req.body.name;
    project.description = req.body.description;
    project.editDate = new Date();

    const result = await repository.save(project);
    res.send(result);
  }
  catch (err) {
    return next(err);
  }
});

router.delete('/project/:id', async function (req: Request, res: Response, next: NextFunction) {
  try {
    const repository = await getProjectRepository();
    await repository.delete({id: Number(req.params.id)});
    res.send('OK');
  }
  catch (err) {
    return next(err);
  }
});
import { NextFunction, Request, Response, Router } from 'express';
import { getRepository } from '../model/repository';
import { Project } from '../model/project';
import { User } from '../model/user';

export const projectRouter: Router = Router();

projectRouter.get('/project', async function (req: Request, res: Response, next: NextFunction) {
  try {
    const repository = await getRepository(Project);
    const allProjects = await repository.find({ 
      relations: ["owner"],
      where: {
          owner: { id: (req as any).user.id }, 
      },
      order: {
          lastUpdate: "DESC",
      },
    });
    console.log((req as any).user.name + ': Get all projects');
    console.log(allProjects);
    res.send(allProjects);
  }
  catch (err) {
    return next(err);
  }
});

projectRouter.get('/project/:uuid', async function (req: Request, res: Response, next: NextFunction) {
  try {
    const repository = await getRepository(Project);
    const project = await repository.findOne({ 
      relations: ["owner"],
      where: {
          owner: { id: (req as any).user.id }, 
          uuid: req.params.uuid,
      },
    });
    console.log((req as any).user.email + ': Get project ' + req.params.uuid);
    res.send(project);
  }
  catch (err) {
    return next(err);
  }
});

projectRouter.post('/project', async function (req: Request, res: Response, next: NextFunction) {
  try {
    const repository = await getRepository(Project);
    const project = new Project();
    project.owner = new User();
    project.owner.id = (req as any).user.id;
    project.name = req.body.name;
    project.description = req.body.description;

    const result = await repository.save(project);
    console.log((req as any).user.name + ': Create project ' + project.uuid);
    res.send(result);
  }
  catch (err) {
    return next(err);
  }
});

projectRouter.post('/project/:uuid', async function (req: Request, res: Response, next: NextFunction) {
  try {
    const repository = await getRepository(Project);
    const project = await repository.findOne({ 
      relations: ["owner"],
      where: {
          owner: { id: (req as any).user.id }, 
          uuid: req.params.uuid,
      },
    });
    project.name = req.body.name;
    project.description = req.body.description;

    const result = await repository.save(project);
    console.log((req as any).user.name + ': Update project ' + req.params.id);
    res.send(result);
  }
  catch (err) {
    return next(err);
  }
});

projectRouter.delete('/project/:uuid', async function (req: Request, res: Response, next: NextFunction) {
  try {
    const repository = await getRepository(Project);
    const project = await repository.findOne({ 
      relations: ["owner"],
      where: {
          owner: { id: (req as any).user.id }, 
          uuid: req.params.uuid,
      },
    });
    await repository.delete(project);
    console.log((req as any).user.name + ': Delete project ' + req.params.uuid);
    res.send('OK');
  }
  catch (err) {
    return next(err);
  }
});
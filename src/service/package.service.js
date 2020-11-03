import db from '../sequelize/models';

export class PackageService {
  static async upsertPackage(pck) {
    return db.package.upsert(
      pck, 
      {
        returning: true
      }
    );
  }
}
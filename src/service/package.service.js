import db from '../sequelize/models';

export class PackageService {
  static async upsertPackage(pck) {
    return db.package.upsert(
      pck,
      {
        attributes: ['description', 'status', 'title', 'ttn', 'text', 'date'],
        returning: true
      }
    );
  }
}
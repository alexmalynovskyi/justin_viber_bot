import db from '../sequelize/models/index';

export class UserService {
  static getUserById(externalId, userProfile) {
    const { id, name, country, language} = userProfile;
    return db.user.findOrCreate({
      where: {
        externalId
      },
      defaults: {
        externalId: id,
          name,
          country,
          language
      }
    });
  }

  static getUserWithExtendedData() {
    return db.user.findOne({
      include: [{
        model: db.package,
        as: 'packages',
        required: false,
        attributes: ['description', 'status', 'title', 'ttn', 'text', 'date'],
      }]
    });
  }

  static getAllUserWithExtendedData(externalId) {
    return db.user.findAll({
      where: {
        externalId
      },
      include: [{
        model: db.package,
        as: 'packages',
        required: false,
        attributes: ['description', 'status', 'title', 'ttn', 'text', 'date'],
      }]
    });
  }
}
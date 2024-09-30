// utils.module.js
angular.module('utils', [])
  .service('VersionCheckService', function() {
      this.parseVersion = function(versionString) {
          const parts = versionString.split('.');
          return parts.map(part => {
              const numericPart = part.replace(/\D/g, ''); // extract numeric part
              const suffix = part.replace(/\d/g, ''); // extract non-numeric suffix (e.g., 'beta')

              return {
                  number: parseInt(numericPart, 10) || 0,
                  suffix: suffix || null
              };
          });
      };

      this.compareVersions = function(currentVersion, requiredVersion) {
          const length = Math.max(currentVersion.length, requiredVersion.length);

          for (let i = 0; i < length; i++) {
              const curr = currentVersion[i] || { number: 0, suffix: null };
              const req = requiredVersion[i] || { number: 0, suffix: null };

              if (curr.number > req.number) return 1;
              if (curr.number < req.number) return -1;

              // compare suffixes: absence of suffix > presence of suffix
              if (curr.suffix && !req.suffix) return -1;
              if (!curr.suffix && req.suffix) return 1;
              if (curr.suffix && req.suffix && curr.suffix > req.suffix) return 1;
              if (curr.suffix && req.suffix && curr.suffix < req.suffix) return -1;
          }

          return 0;
      };

      this.isCameraControlVersion = function(requiredVersionString = '3.60') {
          const currentVersionString = google.maps.version;
          const currentVersion = this.parseVersion(currentVersionString);
          const requiredVersion = this.parseVersion(requiredVersionString);
          return this.compareVersions(currentVersion, requiredVersion) >= 0;
      };
  });


const VersionCheckService = {

}

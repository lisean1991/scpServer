function sqlClient(sql){
  this.insert = function(roleId, openId,role_name){
    var that = this;
    return new Promise(function(resolve,reject){
      that.getByOpenId(openId).then(function(){
        sql.getConnection(function (err, conn) {
            if (err) console.log("POOL ==> " + err);
            conn.query(
              'UPDATE user_map SET role_id = ?,  role_name = ? WHERE open_id = ?' ,
              [roleId,role_name, openId],
              function (err, results, fields) {
                if (err) {
                  console.log(err);
                  reject(err);
                  return;
                }
                resolve(true);
                conn.release();
                //sql.end();
              }
            );
        });
        // sql.query(
        //   'UPDATE user_map SET role_id = ?, open_id = ?, role_name = ? WHERE openId = ?' ,
        //   [roleId, openId,role_name, openId],
        //   function(err, results) {
        //     if (err) {
        //       console.log(err);
        //       reject(false);
        //       return;
        //     }
        //     resolve(true);
        //   }
        // );
      }).catch(function(){
        sql.getConnection(function (err, conn) {
            if (err) console.log("POOL ==> " + err);
            conn.query(
              'INSERT INTO user_map SET role_id = ?, open_id = ?, role_name = ?',
              [roleId, openId,role_name],
              function (err, results) {
                if (err) {
                  console.log(err);
                  reject(err);
                  return;
                }
                // res.end('results: ' + JSON.stringify(results) + '\n');

                resolve(true);
                conn.release();
                //sql.end();
              }
            );
        });
        // sql.query(
        //   'INSERT INTO user_map SET role_id = ?, open_id = ?, role_name = ?',
        //   [roleId, openId,role_name],
        //   function(err, results) {
        //     if (err) {
        //       console.log(err);
        //       reject(false);
        //       return;
        //
        //     }
        //     resolve(true);
        //   }
        // );
      });
    });

  };

  this.getByRole = function(roleId){
    return new Promise(function(resolve,reject){
      sql.getConnection(function (err, conn) {
          if (err) console.log("POOL ==> " + err);
          conn.query(
            'SELECT * FROM user_map WHERE role_id = ?',
            [roleId],
            function (err, results, fields) {
              if (err) {
                console.log(err);
                reject(err);
                return;
              }
              // res.end('results: ' + JSON.stringify(results) + '\n');
              if(results.length > 0){
                console.log("role_name1");
                resolve(results);
              }else{
                console.log("role_name2");
                reject();
              }
              console.log(results[0]);
              conn.release();
              //sql.end();
            }
          );
      });
      // sql.query(
      //   'SELECT * FROM user_map WHERE role_id = ?',
      //   [roleId],
      //   function (err, results, fields) {
      //     if (err) {
      //       console.log(err);
      //       reject(err);
      //       return;
      //     }
      //     // res.end('results: ' + JSON.stringify(results) + '\n');
      //     if(results.length > 0){
      //       resolve(results);
      //     }else{
      //       reject();
      //     }
      //
      //     console.log(results);
      //     //sql.end();
      //   }
      // );
    });

  };

  this.getByOpenId = function(openId){
    return new Promise(function(resolve,reject){
      sql.getConnection(function (err, conn) {
          if (err) console.log("POOL ==> " + err);
          conn.query(
            'SELECT * FROM user_map WHERE open_id = ?',
            [openId],
            function (err, results, fields) {
              if (err) {
                console.log(err);
                reject(err);
                return;
              }
              // res.end('results: ' + JSON.stringify(results) + '\n');
              if(results.length > 0){
                console.log("role_name1");
                resolve(results);
              }else{
                console.log("role_name2");
                reject();
              }
              console.log(results[0]);
              conn.release();
              //sql.end();
            }
          );
      });
    });
  };

  this.getFormId = function(open_id){
    return new Promise(function(resolve,reject){
      sql.getConnection(function (err, conn) {
          if (err) console.log("POOL ==> " + err);
          conn.query(
            'SELECT * FROM form_id WHERE open_id = ?',
            [open_id],
            function (err, results, fields) {
              if (err) {
                console.log(err);
                reject(err);
                return;
              }
              // res.end('results: ' + JSON.stringify(results) + '\n');
              if(results.length > 0){
                resolve(results);
                console.log(results[0]);
              }else{
                reject();
              }
              conn.release();
              //sql.end();
            }
          );
      });
    });
  };

  this.insertFormId = function(id,open_id){
    return new Promise(function(resolve,reject){
      sql.getConnection(function (err, conn) {
          if (err) console.log("POOL ==> " + err);
          conn.query(
            'INSERT INTO form_id SET id = ?, open_id = ?',
            [id,open_id],
            function (err, results) {
              if (err) {
                console.log(err);
                reject(err);
                return;
              }
              // res.end('results: ' + JSON.stringify(results) + '\n');
              if(results.length > 0){
                console.log("role_name1");
                resolve(results);
              }else{
                console.log("role_name2");
                reject();
              }
              conn.release();
              //sql.end();
            }
          );
      });
    });
  };

  this.deleteFormid = function(id){
    return new Promise(function(resolve,reject){
      sql.getConnection(function (err, conn) {
          if (err) console.log("POOL ==> " + err);
          conn.query(
            'DELETE  FROM form_id WHERE id = \''+id+"\'",
            function (err, results) {
              if (err) {
                console.log(err);
                reject(err);
                return;
              }
              // res.end('results: ' + JSON.stringify(results) + '\n');
              console.log(id);
              conn.release();
              //sql.end();
            }
          );
      });
    });
  };
}

module.exports = sqlClient;

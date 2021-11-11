const oracledb = require('oracledb')

async function checkConnection() {
  let connection
  try {
    connection = await oracledb.getConnection( {
      user: 'atlas_staging',
      password: '${{secret.ORACLEPASS}}',
      connectString: 'oracle.luomus.fi:1521/oracle.luomus.fi',
    })
    console.log('Connected to Oracle Database')


    const result = await connection.execute('SELECT * FROM species', [],
        {resultSet: true, outFormat: oracledb.OUT_FORMAT_OBJECT})
    const rs = result.resultSet

    let row

    while (row = await rs.getRow())
      if (row.VISIBILITY === 1 && row.MXCODE > 40000)
        console.log(row.MXCODE, row.SPECIESFI)


    await rs.close()
  } catch (err) {
    console.error(err.message)
  } finally {
    if (connection)
      try {
        await connection.close()
        console.log('Database connection closed')
      } catch (err) {
        console.error(err.message);
      }
  }
}

checkConnection()

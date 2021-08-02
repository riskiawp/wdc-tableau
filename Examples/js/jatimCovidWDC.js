(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "id",
            dataType: tableau.dataTypeEnum.string
        },
        {
            id: "provinsi",
            dataType: tableau.dataTypeEnum.string
        },
        {
            id: "kode_kabupaten_kota",
            dataType: tableau.dataTypeEnum.int
        },
        {
            id: "nama_kabupaten_kota",
            dataType: tableau.dataTypeEnum.string
        },
        {
            id: "jumlah_bencana",
            dataType: tableau.dataTypeEnum.int
        },
        {
            id: "satuan",
            dataType: tableau.dataTypeEnum.string
        },
        {
            id: "tahun",
            dataType: tableau.dataTypeEnum.int
        }
    ];

        var tableSchema = {
            id: "earthquakeFeed",
            alias: "Earthquakes with magnitude greater than 4.5 in the last seven days",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("https://coredata-dev.digitalservice.id/bpbd/od_jumlah_kejadian_bencana_banjir", function(resp) {
            var feat = resp.data,
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                tableData.push({
                    "id": feat[i].id,
                    "provinsi": feat[i].provinsi,
                    "kode_kabupaten_kota": feat[i].kode_kabupaten_kota,
                    "nama_kabupaten_kota": feat[i].nama_kabupaten_kota,
                    "jumlah_bencana": feat[i].jumlah_bencana,
                    "satuan": feat[i].satuan,
                    "tahun": feat[i].tahun
                });
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "USGS Earthquake Feed"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();

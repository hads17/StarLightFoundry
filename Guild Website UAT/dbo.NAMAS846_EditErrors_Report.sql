ALTER PROCEDURE  dbo.NAMAS846_EditErrors_Report
    @Customer_ID NVARCHAR(10),
    @StartDate DATETIME = '1/1/1900'
AS
IF @StartDate = '1/1/1900'
BEGIN
    SET @StartDate = DATEADD(HOUR, -24, GETUTCDATE());
END;

DECLARE @Data TABLE
(
    DocumentNbr INT,
    CurrentState NVARCHAR(50),
    EntryDate DATETIME,
    VendorName NVARCHAR(50),
    VendorNbr NVARCHAR(50),
    InvoiceNbr NVARCHAR(50),
    InvoiceDate DATETIME,
    ImportFileName NVARCHAR(500),
    Image_ID NVARCHAR(500)
);

INSERT INTO @Data
SELECT vd.DraftNbr,
      'Draft',
      vd.EntryDate,
      ISNULL(
      (
          SELECT REPLACE(v.Name, ',', '')
          FROM dbo.Vendor v WITH (NOLOCK)
          WHERE v.ID = vd.FK_VendorID
      ),
      ''
            ),
      ISNULL(
      (
          SELECT vc.CustVendorNbr
          FROM dbo.VendorsCustomer vc WITH (NOLOCK)
          WHERE vc.FK_VendorID = vd.FK_VendorID
                AND vc.FK_CustomerID = vd.FK_CustomerID
      ),
      ''
            ),
      vd.InvoiceNbr,
      vd.InvoiceDate,
      vd.ImportFileName,
      ISNULL(
      (
          SELECT vdcf.Value
          FROM dbo.VIHDraftChartField vdcf WITH (NOLOCK)
          WHERE vdcf.FK_DraftNbr = vd.DraftNbr
                AND vdcf.ChartFieldNbr = 25
      ),
      ''
            )
FROM dbo.VIHDraft vd WITH (NOLOCK)
WHERE vd.FK_CustomerID = 'NAMAS846'
      AND vd.Source = 'image'
      AND CAST(CONVERT(NVARCHAR(50), vd.EntryDate, 101) AS DATETIME) >= @StartDate;

INSERT INTO @Data
SELECT vd.DocumentNbr,
      'Invoice',
      vd.EntryDate,
      ISNULL(
      (
          SELECT v.Name FROM dbo.Vendor v WITH (NOLOCK) WHERE v.ID = vd.FK_VendorID
      ),
      ''
            ),
      ISNULL(
      (
          SELECT vc.CustVendorNbr
          FROM dbo.VendorsCustomer vc WITH (NOLOCK)
          WHERE vc.FK_VendorID = vd.FK_VendorID
                AND vc.FK_CustomerID = vd.FK_CustomerID
      ),
      ''
            ),
      vd.InvoiceNbr,
      vd.InvoiceDate,
      vd.ImportFileName,
      ISNULL(
      (
          SELECT vdcf.Value
          FROM dbo.VIHChartField vdcf WITH (NOLOCK)
          WHERE vdcf.FK_DocumentNbr = vd.DocumentNbr
                AND vdcf.ChartFieldNbr = 25
      ),
      ''
            )
FROM dbo.VendorInvoiceHeader vd WITH (NOLOCK)
WHERE vd.FK_CustomerID = 'NAMAS846'
      AND vd.Source = 'image'
      AND CAST(CONVERT(NVARCHAR(50), vd.EntryDate, 101) AS DATETIME) >= @StartDate
      AND vd.DocumentNbr NOT IN
          (
              SELECT ih.FK_DocumentNbr
              FROM dbo.Invoice_History ih WITH (NOLOCK)
              WHERE ih.FK_DocumentNbr = vd.DocumentNbr
                    AND ih.ActionDescription = 'Draft submitted'
                    AND ih.FK_UserID = 1
          );







SELECT d.*,
      REPLACE(ce.ErrorMsg, ',', '') ErrorMsg
FROM @Data d
    JOIN dbo.InvoiceEditError iee WITH (NOLOCK)
        ON d.DocumentNbr = iee.Invoice_DocumentNbr
    JOIN dbo.CustomerEdit ce WITH (NOLOCK)
        ON iee.CustomerEdit_ID = ce.ID
WHERE iee.EditCheckTS =
(
    SELECT MIN(iee2.EditCheckTS)
    FROM dbo.InvoiceEditError iee2 WITH (NOLOCK)
    WHERE iee2.Invoice_DocumentNbr = iee.Invoice_DocumentNbr
);

















/*
SELECT ce.ErrorMsg,
      *
FROM dbo.InvoiceEditError iee WITH (NOLOCK)
    JOIN dbo.CustomerEdit ce WITH (NOLOCK)
        ON iee.CustomerEdit_ID = ce.ID
WHERE iee.Invoice_DocumentNbr = 4963820
      AND iee.EditCheckTS =
      (
          SELECT MIN(iee2.EditCheckTS)
          FROM dbo.InvoiceEditError iee2 WITH (NOLOCK)
          WHERE iee2.Invoice_DocumentNbr = iee.Invoice_DocumentNbr
      );

SELECT *
FROM dbo.Invoice_History ih
WHERE ih.FK_DocumentNbr = 4963820;



SELECT ce.ErrorMsg,
      *
FROM dbo.InvoiceEditError iee WITH (NOLOCK)
    JOIN dbo.CustomerEdit ce WITH (NOLOCK)
        ON iee.CustomerEdit_ID = ce.ID
WHERE iee.Invoice_DocumentNbr = 4965385
      AND iee.EditCheckTS =
      (
          SELECT MIN(iee2.EditCheckTS)
          FROM dbo.InvoiceEditError iee2 WITH (NOLOCK)
          WHERE iee2.Invoice_DocumentNbr = iee.Invoice_DocumentNbr
      );


SELECT *
FROM dbo.Invoice_History ih
WHERE ih.FK_DocumentNbr = 4965385;


SELECT ce.ErrorMsg,
      *
FROM dbo.InvoiceEditError iee WITH (NOLOCK)
    JOIN dbo.CustomerEdit ce WITH (NOLOCK)
        ON iee.CustomerEdit_ID = ce.ID
WHERE iee.Invoice_DocumentNbr = 4274877
      AND iee.EditCheckTS =
      (
          SELECT MIN(iee2.EditCheckTS)
          FROM dbo.InvoiceEditError iee2 WITH (NOLOCK)
          WHERE iee2.Invoice_DocumentNbr = iee.Invoice_DocumentNbr
      );


SELECT *
FROM dbo.Invoice_History ih
WHERE ih.FK_DocumentNbr = 4274877;

*/
GO
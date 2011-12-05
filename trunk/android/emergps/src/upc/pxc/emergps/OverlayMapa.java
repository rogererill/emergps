package upc.pxc.emergps;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Point;
import android.widget.Toast;

import com.google.android.maps.GeoPoint;
import com.google.android.maps.MapView;
import com.google.android.maps.Overlay;
import com.google.android.maps.Projection;

public class OverlayMapa extends Overlay {
	
	static final int VAL_INCID = 0;
	static final int VAL_POL = 1;
	static final int VAL_BOMB = 2;
	static final int VAL_AMB = 3;
	
	private float latitud;
	private float longitud;
	private int type;
	
	OverlayMapa(int type, float posx, float posy){
		this.longitud  =  posx;
		this.latitud = posy;
	}
	
	@Override
	public void draw(Canvas canvas, MapView mapView, boolean shadow) 
	{
		Projection projection = mapView.getProjection();
		GeoPoint geoPoint = 
			new GeoPoint(Math.round(latitud*1000000), Math.round(longitud*1000000));
		
		if (shadow == false) 
		{
			Point centro = new Point();
			projection.toPixels(geoPoint, centro);

			//Definimos el pincel de dibujo
			Paint p = new Paint();
			p.setColor(Color.BLUE);
			
			//Marca Ejemplo 1: Círculo y Texto
			//canvas.drawCircle(centro.x, centro.y, 5, p);
			//canvas.drawText("Sevilla", centro.x+10, centro.y+5, p);
			
			//Marca Ejemplo 2: Bitmap
			Bitmap bm;
			switch(type){
			case VAL_INCID:
				bm = BitmapFactory.decodeResource(mapView.getResources(), R.drawable.incidencia);
				break;
			case VAL_POL:
				bm = BitmapFactory.decodeResource(mapView.getResources(), R.drawable.policia);
				break;
			case VAL_BOMB:
				bm = BitmapFactory.decodeResource(mapView.getResources(), R.drawable.bomber);
				break;
			default:	// VAL_AMB
				bm = BitmapFactory.decodeResource(mapView.getResources(), R.drawable.ambulancia);
				
			}

			
			canvas.drawBitmap(bm, centro.x - bm.getWidth(), centro.y - bm.getHeight(), p);
		}
	}
	
	@Override
	public boolean onTap(GeoPoint point, MapView mapView) 
	{
		Context contexto = mapView.getContext();
		String msg = "Lat: " + point.getLatitudeE6()/1E6 + " - " + 
		             "Lon: " + point.getLongitudeE6()/1E6;
		
		Toast toast = Toast.makeText(contexto, msg, Toast.LENGTH_SHORT);
		toast.show();
		
		return true;
	}
}
